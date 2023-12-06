import { LivreService } from './../services/livre.service';
import { Component, OnInit } from '@angular/core';
import { Livre } from '../model/livre.model';
import { AuthService } from '../services/auth.service';
import { Image } from '../model/image.model';



@Component({
  selector: 'app-livres',
  templateUrl: './livres.component.html',
  styleUrls: ['./livres.component.css']
})
export class LivresComponent implements OnInit {
  livres?: Livre[];
  loading: boolean = false;

  apiurl:string='http://localhost:8085/livres/api';

  constructor(private livreService: LivreService,
              public authService: AuthService) {

    //this.livres = this.livreService.listeLivres();
  }



  ngOnInit(): void {
    this.livreService.listeLivres().subscribe(prods => {
      console.log(prods);
      this.livres = prods;
      });

     this.chargerLivres();

  }

 
    
  chargerLivres(){
  
      this.livreService.listeLivres().subscribe(prods => {
        this.livres = prods;
    
        this.livres.forEach((prod) => {
          // Tri des images par idImage
          prod.images.sort((a, b) => b.idImage - a.idImage);
    
          // Sélection de la dernière image (celle avec le plus grand idImage)
          const lastImage = prod.images[0];
    
          // Mise à jour de l'URL de l'image dans l'objet du livre
          prod.imageStr = 'data:' + lastImage.type + ';base64,' + lastImage.image;
        });
      });
    }
    
    supprimerLivre(livre: Livre) {
      console.log("Début de la méthode supprimerLivre");
      let conf = confirm("Etes-vous sûr ?");
      
      if (conf) {
        console.log("Confirmation reçue");
    
        // Show loading indicator
        this.loading = true;
    
        if (livre.images && livre.images.length > 0) {
          console.log("Le livre a des images");
          this.livreService.supprimerLivreAvecImages(livre.idLivre!).subscribe(
            () => {
              console.log("Livre et ses images supprimés avec succès");
              this.chargerLivres();
              // Hide loading indicator on success
              this.loading = false;
            },
            (error) => {
              console.error("Erreur lors de la suppression du livre avec images:", error);
              // Hide loading indicator on error
              this.loading = false;
            }
          );
        } else {
          console.log("Le livre n'a pas d'image");
          this.livreService.supprimerLivre(livre.idLivre!).subscribe(
            () => {
              console.log("Livre supprimé avec succès");
              this.chargerLivres();
              // Hide loading indicator on success
              this.loading = false;
            },
            (error) => {
              console.error("Erreur lors de la suppression du livre:", error);
              // Hide loading indicator on error
              this.loading = false;
            }
          );
        }
      }
    }
    
    
       
    
  /*supprimerLivre(l: Livre)
{
  let conf = confirm("Etes-vous sûr ?");
   if (conf)
   this.livreService.supprimerLivre(l.idLivre!).subscribe(() => {
    console.log("livre supprimé");
    this.chargerLivres();
    });
  }*/





}
