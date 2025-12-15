import axios from 'axios';
import emailConfig from '../utils/emailConfig.js';

class BrevoService {
    constructor() {
        this.apiKey = emailConfig.brevo.apiKey;
        this.baseUrl = emailConfig.brevo.baseUrl;

        this.client = axios.create({
            baseURL: this.baseUrl,
            headers:{
                'api-key': this.apiKey,
                'Content-Type': 'application/json'
            }
        });
    }

    async getTemplate(templateId) {
        try{
            console.log("WELCOME TEMPLATE ID =", templateId);
            console.log("Type =", typeof templateId);

            console.log("BREVO API KEY length:", this.apiKey ? this.apiKey.length : 'undefined');


            if (!templateId || isNaN(templateId)) {
                throw new Error(`Invalid template ID: ${templateId}. Please check your BREVO_TEMPLATE_* environment variables.`);
            }
            const response = await this.client.get(`/smtp/templates/${templateId}`);
            return{
                success: true,
                data: response.data
            };
        }catch(err){
            console.error(`Error fetching Brevo template ${templateId}:`, err.message);
            return{
                success: false,
                error: err.response?.data || err.message
            }
        }
    }

    replaceVariables(htmlContent, variables){
        let processedHtml = htmlContent;

        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            processedHtml = processedHtml.replace(RegExp, variables[key] || '');
        })

        return processedHtml;
    }

     async getProcessedTemplate(templateId, variables) {
    try {
      console.log("getProcessedTemplate log :trying to fetch template with templateID:", templateId);

      const templateResult = await this.getTemplate(templateId);
      
      if (!templateResult.success) {
        throw new Error(`Failed to fetch template: ${templateResult.error}`);
      }

      const template = templateResult.data;
      
      // Replace variables in both HTML and text content
      const htmlContent = this.replaceVariables(
        template.htmlContent || '', 
        variables
      );
      
      const subject = this.replaceVariables(
        template.subject || '', 
        variables
      );

      return {
        success: true,
        htmlContent,
        subject,
        templateName: template.name
      };
    } catch (error) {
      console.error('Error processing template:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * List all templates (useful for debugging)
   * @returns {Promise<Object>} List of templates
   */
  async listTemplates() {
    try {
      const response = await this.client.get('/smtp/templates');
      return {
        success: true,
        templates: response.data.templates
      };
    } catch (error) {
      console.error('Error listing templates:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new BrevoService();
