package tn.esprit.profile_service.service;

import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmailService {


     JavaMailSender mailSender;

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);  // Envoie l'email
            System.out.println("E-mail envoyé avec succès");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail");
        }
    }
    /**
     * Fonction pour envoyer un e-mail HTML pour informer d'une modification du profil.
     * @param to L'adresse e-mail du destinataire
     * @param userName Le nom de l'utilisateur à inclure dans le message
     */
    public void sendProfileModificationEmail(String to, String userName) {
        String htmlContent = "<html><body style='font-family: Arial, sans-serif; color: #333;'>"
                + "<h1 style='color: #553CDF;'>Bienvenue sur notre boutique en ligne !</h1>"
                + "<p>Bonjour " + userName + ",</p>"
                + "<p>Nous vous confirmons la création de votre profil sur notre boutique e-commerce. 🎉</p>"
                + "<p>Vous pouvez désormais accéder à votre compte, passer des commandes, suivre vos livraisons et bien plus encore.</p>"
                + "<p>Pour consulter votre profil, cliquez sur le bouton ci-dessous :</p>"
                + "<a href='http://exemple.com/mon-compte' "
                + "style='display: inline-block; background-color: #553CDF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>"
                + "Accéder à mon compte</a>"
                + "<p style='margin-top: 30px;'>Merci de votre confiance,</p>"
                + "<p>L'équipe de E-Shop</p>"
                + "<div style='color: #999999; font-size: 12px; text-align: center; margin-top: 30px;'>"
                + "<p>Pour toute question, contactez-nous à <a href='mailto:support@exemple.com'>support@exemple.com</a>.</p>"
                + "<p>© 2025 E-Shop. Tous droits réservés.</p>"
                + "</div>"
                + "</body></html>";



        try {
            // Création du message MIME
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);  // true pour activer le HTML

            // Configuration de l'e-mail
            helper.setTo(to);
            helper.setSubject("Modification de votre profil");
            helper.setText(htmlContent, true);  // Le "true" indique qu'il s'agit d'un contenu HTML

            // Envoi de l'e-mail
            mailSender.send(message);
            System.out.println("E-mail de modification de profil envoyé avec succès");

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur lors de l'envoi de l'e-mail");
        }
    }
}
