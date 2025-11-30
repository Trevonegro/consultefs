
import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertCircle, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface RequestGuideProps {
  onSubmit: (data: { specialty: string; doctor: string; attachmentUrl: string }) => void;
}

const RequestGuide: React.FC<RequestGuideProps> = ({ onSubmit }) => {
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !specialty || !doctor) {
        alert("Por favor, preencha todos os campos e anexe a foto do pedido.");
        return;
    }

    setIsSubmitting(true);

    try {
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '')}`;
        const { data, error } = await supabase.storage
            .from('guide-attachments')
            .upload(fileName, file);
        
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('guide-attachments').getPublicUrl(fileName);

        onSubmit({
            specialty,
            doctor,
            attachmentUrl: publicUrl
        });
        
        setSuccess(true);
        // Reset form
        setSpecialty('');
        setDoctor('');
        setFile(null);
        setPreviewUrl(null);
    } catch (error) {
        console.error(error);
        alert("Erro ao enviar imagem. Tente novamente.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (success) {
      return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-military-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 text-center animate-fade-in transition-colors">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100 mb-2">Solicitação Enviada!</h2>
              <p className="text-gray-500 dark:text-military-400 mb-6">
                  Sua solicitação de guia foi recebida. O setor responsável irá analisar o pedido médico e iniciar a confecção.
                  <br/>Acompanhe o status pelo menu "Minhas Guias".
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="bg-gray-900 dark:bg-military-950 text-white px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-military-700 transition-colors"
              >
                  Nova Solicitação
              </button>
          </div>
      )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-military-900 rounded-2xl shadow-sm border border-gray-200 dark:border-military-700 overflow-hidden transition-colors">
        <div className="bg-gray-50 dark:bg-military-800 p-6 border-b border-gray-200 dark:border-military-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-military-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                Solicitar Guia Médica
            </h2>
            <p className="text-gray-500 dark:text-military-400 mt-1">
                Preencha os dados e anexe uma foto legível do seu pedido médico (receituário).
            </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-military-400">Especialidade / Procedimento</label>
                    <input 
                        type="text"
                        placeholder="Ex: Cardiologia, Raio-X..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-military-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white dark:bg-military-950 text-gray-800 dark:text-military-100"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-military-400">Médico Solicitante</label>
                    <input 
                        type="text"
                        placeholder="Nome do médico no pedido"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-military-600 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all bg-white dark:bg-military-950 text-gray-800 dark:text-military-100"
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-military-400">Foto do Pedido Médico</label>
                
                {!previewUrl ? (
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 dark:border-military-600 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-military-800 hover:border-red-300 transition-all group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                            <Upload className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="font-medium text-gray-600 dark:text-military-300">Clique para enviar ou arraste a foto aqui</p>
                        <p className="text-sm text-gray-400 dark:text-military-500 mt-1">Formatos aceitos: JPG, PNG (Max 5MB)</p>
                    </div>
                ) : (
                    <div className="relative border border-gray-200 dark:border-military-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-military-800">
                         <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-military-600 bg-white dark:bg-military-900">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-gray-500 dark:text-military-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-military-200 truncate max-w-[200px]">{file?.name}</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={clearFile}
                                className="text-gray-400 dark:text-military-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                         </div>
                         <div className="p-4 flex justify-center">
                            <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg shadow-sm" />
                         </div>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    Certifique-se de que a foto está nítida e mostra todas as informações do pedido (data, assinatura e carimbo do médico).
                </p>
            </div>

            <div className="flex justify-end pt-2">
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-red-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? 'Enviando...' : (
                        <>
                           Enviar Solicitação <Check className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default RequestGuide;
