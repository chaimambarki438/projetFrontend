import { ListeBibliothequesComponent } from './../liste-bibliotheques/liste-bibliotheques.component';

import { Component, OnInit } from '@angular/core';
import { Livre } from '../model/livre.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LivreService } from '../services/livre.service';
import { Bibliotheque } from '../model/bibliotheque.model';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-update-livre',
  templateUrl: './update-livre.component.html',
  styles: [
  ]
})
export class UpdateLivreComponent implements OnInit {

  currentLivre = new Livre();
  bibliotheques! :Bibliotheque[];
  updatedBibId! : number;
  myImage! : string;
  uploadedImage!: File;
isImageUpdated: Boolean=false;


constructor(private activatedRoute: ActivatedRoute,
            private livreService: LivreService,
            private router :Router,
            ) { }


ngOnInit(){
  this.livreService.listeBiblitheques().
  subscribe(cats => {this.bibliotheques= cats._embedded.bibliotheques;
    console.log(cats);
  });
  this.livreService.consulterLivre(this.activatedRoute.snapshot.params['id'])
  .subscribe( prod =>{ this.currentLivre = prod;
  this.updatedBibId = prod.bibliotheque.idBib;

  this.loadLastImage();
   });

  }


  loadLastImage() {
    if (this.currentLivre.images && this.currentLivre.images.length > 0) {
      // Tri des images par idImage
      this.currentLivre.images.sort((a, b) => b.idImage - a.idImage);
      const lastImage = this.currentLivre.images[0];
      this.loadImage(lastImage.idImage);
    }
  }

  loadImage(imageId: number) {
    this.livreService.loadImage(imageId)
      .subscribe((img: Image) => {
        this.myImage = 'data:' + img.type + ';base64,' + img.image;
      });
  }
 


updateLivre()
{
  this.currentLivre.bibliotheque = this.bibliotheques.find(cat => cat.idBib == this.updatedBibId)!;

  this.livreService.updateLivre(this.currentLivre).subscribe(prod => {

           this.router.navigate(['livres']);
  
});

      }
     
//image



onImageUpload(event: any) {
  if(event.target.files && event.target.files.length) {
  this.uploadedImage = event.target.files[0];
  this.isImageUpdated =true;
  const reader = new FileReader();
  reader.readAsDataURL(this.uploadedImage);
  reader.onload = () => { this.myImage = reader.result as string; };
  }
}

onAddImageLivre(){
    this.livreService
    .uploadImageLivr(this.uploadedImage,this.uploadedImage.name,this.currentLivre.idLivre!)
        .subscribe( (img : Image) => {
              this.currentLivre.images.push(img);
             });
}
  

 

  supprimerImage(img: Image){
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
    this.livreService.supprimerImage(img.idImage).subscribe(() => {
    //supprimer image du tableau currentProduit.images 
    const index = this.currentLivre.images.indexOf(img, 0);
    if (index > -1) {
    this.currentLivre.images.splice(index, 1);
    }
    });
    }
    
   
  
    
  }






