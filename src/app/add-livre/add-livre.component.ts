import { LivreService } from './../services/livre.service';
import { Bibliotheque } from './../model/bibliotheque.model';
import { Component, OnInit } from '@angular/core';
import { Livre } from '../model/livre.model';

import { Router } from '@angular/router';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-add-livre',
  templateUrl: './add-livre.component.html',
  styleUrls: ['./add-livre.component.css']
})
export class AddLivreComponent implements OnInit {
  newLivre = new Livre();
  bibliotheques! : Bibliotheque[];
  newIdBib! : number;
  newBibliotheque! : Bibliotheque;
  uploadedImages!: File;
  imagePath: any;
 // images: Image[] = [];

  constructor(private livreService: LivreService,
    private router : Router) { }

    ngOnInit(): void {

      this. livreService.listeBiblitheques().
            subscribe(cats => {this.bibliotheques = cats._embedded.bibliotheques;
              console.log(cats);
          });
   
    }
  
    addLivre() {
      // Step 1: Add the new plat
      this.livreService.ajouterLivre(this.newLivre)
        .subscribe((addedlivr: Livre) => {
          // Step 2: Upload the image
          this.livreService.uploadImageLivr(this.uploadedImages, this.uploadedImages.name , addedlivr.idLivre!)
            .subscribe((img: Image) => {
              // Step 3: Associate the image with the new plat
              addedlivr.bibliotheque = this.bibliotheques.find(cat => cat.idBib == this.newIdBib)!;
              img.idImage = addedlivr.idLivre!;
              console.log(addedlivr.idLivre)
              console.log(img.idImage); // Assuming idPlat is the ID property of Plat
              addedlivr.image = img;
    
              // Step 4: Update the plat with the associated image
              this.livreService.updateLivre(addedlivr)
                .subscribe(() => {
                  this.router.navigate(['livres']);
                });
            });
        });
    } 
     
  
    onImageUpload(event: any) {
      this.uploadedImages = event.target.files[0];
      var reader=new FileReader();
      reader.readAsDataURL(this.uploadedImages);
      reader.onload=(_event)=>{
        this.imagePath=reader.result;
      }
    }

        
        
  
  }


