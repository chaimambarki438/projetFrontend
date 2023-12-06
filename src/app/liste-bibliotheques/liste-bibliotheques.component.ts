import { Router } from '@angular/router';
import { Bibliotheque } from '../model/bibliotheque.model';
import { AuthService } from '../services/auth.service';
import { LivreService } from '../services/livre.service';
import { BibliothequeWrapper } from './../model/bibliothequeWrapped.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liste-bibliotheques',
  templateUrl: './liste-bibliotheques.component.html',
  styles: [
  ]
})
export class ListeBibliothequesComponent implements OnInit {

  bibliotheques! : Bibliotheque[];
  updatedBib:Bibliotheque = {"idBib":0,"nomBib":""};
  ajout:boolean=true;
  
  constructor(private livreService : LivreService,
    public authService: AuthService,
      private router :Router) { }

  ngOnInit(): void {
    this.chargerBibliotheque();
    this.authService.loadToken();
    if (this.authService.getToken()==null ||
     this.authService.isTokenExpired())
     this.router.navigate(['/login']);
  }
  onLogout(){
    this.authService.logout();
  }


  bibliothequeUpdated(bib:Bibliotheque){
    console.log("Bib updated event",bib);
    this.livreService.ajouterBibliotheque(bib).
     subscribe( ()=> this.chargerBibliotheque());
    }  


    chargerBibliotheque(){
      this.livreService.listeBiblitheques().
      subscribe(cats => {this.bibliotheques = cats._embedded.bibliotheques;
      console.log(cats);
      
      });
      }


  updateBib(bib:Bibliotheque) {
        this.updatedBib=bib;
        this.ajout=false; 
        }
  
  supprimerBib(bib:Bibliotheque) {
          let conf = confirm("Etes-vous sûr ?");
          if (conf) {
            this.livreService.supprimerBib(bib.idBib).subscribe(() => {
              console.log("Bibliotheque supprimé");
            this.chargerBibliotheque();
            });
          }
        }  
 
        }
