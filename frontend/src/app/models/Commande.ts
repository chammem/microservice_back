export interface ArticlePanier {
    id: number;
    nom: string;
    quantite: number;
    prix: number;
  }
  
  export interface Commande {
    id?: number;
    nomClient: string;
    prenomClient: string;
    adresseClient: string;
    codePostal: string;
    telephone: string;
    email: string;
    notes?: string;
    statutCommande?: string;
    statutPaiement?: string;
    totalCommande: number;
    articlesPanier: ArticlePanier[];
  }