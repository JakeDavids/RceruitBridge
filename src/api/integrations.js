// Supabase integrations
// Migrated from Base44 - see QUICKSTART_SUPABASE.md
import { InvokeLLM, SendEmail, UploadFile, supabase } from './supabaseClient';

// Core integrations
export const Core = {
  InvokeLLM,
  SendEmail,
  UploadFile,

  // Additional functions (to be implemented as needed)
  GenerateImage: async (params) => {
    console.warn('GenerateImage not yet implemented with Supabase');
    throw new Error('GenerateImage requires Edge Function implementation');
  },

  ExtractDataFromUploadedFile: async (params) => {
    console.warn('ExtractDataFromUploadedFile not yet implemented');
    throw new Error('ExtractDataFromUploadedFile requires Edge Function implementation');
  },

  CreateFileSignedUrl: async ({ path }) => {
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUrl(path, 3600); // 1 hour expiry
    if (error) throw error;
    return { signedUrl: data.signedUrl };
  },

  UploadPrivateFile: async ({ file }) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `private/${fileName}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);

    if (error) throw error;
    return { path: filePath };
  }
};

// Export individual functions
export { InvokeLLM, SendEmail, UploadFile };

export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;






