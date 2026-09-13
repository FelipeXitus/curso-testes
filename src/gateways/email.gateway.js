export class EmailGateway {
    async enviarEmail(destinatario, assunto, corpo) {
        // Lógica para enviar o email
        console.log(`Enviando email para: ${destinatario}`);
        console.log(`Assunto: ${assunto}`);
        console.log(`Corpo: ${corpo}`);
    }
}