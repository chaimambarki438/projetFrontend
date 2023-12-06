import { Injectable } from '@angular/core';
import { Livre } from '../model/livre.model';
import { Bibliotheque } from '../model/bibliotheque.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BibliothequeWrapper } from '../model/bibliothequeWrapped.model';
import { AuthService } from './auth.service';
import { Image } from '../model/image.model';
import { Byte } from '@angular/compiler/src/util';


const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};

@Injectable({
  providedIn: 'root'
})
export class LivreService {
  apiURLCat: string = 'http://localhost:8089/livres/cat';
  apiURL: string = 'http://localhost:8089/livres/api';
  livres! : Livre[]; 
  livre!:Livre;
  //bibliotheques :Bibliotheque[];

  
  constructor(private http : HttpClient,
    private authService :AuthService) { 
  /*this.bibliotheques = [ {idBib : 1, nomBib : "bibliotheque X"},
                            {idBib : 2, nomBib : "bibliotheque Y"}
                          ]; 
    */
   /* this.livres = [
    {idLivre : 1, titreLivre : "livre", prixLivre: 50.00, dateOuverture: new Date("01/01/2021")
              ,bibliotheque : {idBib : 1, nomBib : "bibliotheque X"}},
    {idLivre : 2, titreLivre : "livre1", prixLivre: 60.00, dateOuverture: new Date("01/14/2023"),
                bibliotheque : {idBib : 2, nomBib : "bibliotheque Y"}},
    {idLivre : 3, titreLivre : "livre2", prixLivre: 30.00, dateOuverture: new Date("03/20/2019"),
                bibliotheque : {idBib : 1, nomBib : "bibliotheque X"},},
    {idLivre : 4, titreLivre : "livre3", prixLivre: 100.00, dateOuverture: new Date("09/18/2020"),
               bibliotheque : {idBib : 2, nomBib : "bibliotheque Y"}}
     ];*/
    }

listeLivres(): Observable<Livre[]> 
 { 
 /* let jwt = this.authService.getToken();
  jwt = "Bearer"+jwt;
  let httpHeaders = new HttpHeaders({"Authorization":jwt})
  */
  return this.http.get<Livre[]>(this.apiURL+"/all");
 
   
  }
  
ajouterLivre(prod:Livre): Observable<Livre>
  { 
    let jwt = this.authService.getToken();
    jwt = "Bearer"+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt}) 
    return this.http.post<Livre>(this.apiURL+"/addlivr", prod, {headers:httpHeaders})
  }
 

supprimerLivre(id : number) {
  const url = `${this.apiURL}/dellivr/${id}`;
  let jwt = this.authService.getToken();
  jwt = "Bearer"+jwt;
  let httpHeaders = new HttpHeaders({"Authorization":jwt}) 
  return this.http.delete(url, {headers:httpHeaders});
  }
///supprimer livre avec tous l'image///
  supprimerLivreAvecImages(idLivre: number): Observable<void> {
    const url = `${this.apiURL}/${idLivre}/supprimerAvecImages`;
    return this.http.delete<void>(url);
  }

consulterLivre(id: number): Observable<Livre> {
  const url = `${this.apiURL}/getbyid/${id}`;
  let jwt = this.authService.getToken();
  jwt = "Bearer"+jwt;
  let httpHeaders = new HttpHeaders({"Authorization":jwt}) 
  return this.http.get<Livre>(url,{headers:httpHeaders});
  }


  updateLivre(prod :Livre) : Observable<Livre> {
    let jwt = this.authService.getToken();
    jwt = "Bearer"+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt}) 
    return this.http.put<Livre>(this.apiURL+"/updatelivr", prod, {headers:httpHeaders});
    }
    

trierLivres(){
  this.livres = this.livres.sort((n1,n2) => {
  if (n1.idLivre! > n2.idLivre!) {
  return 1;
  }
  if (n1.idLivre! < n2.idLivre!) {
  return -1;
  }
  return 0;
  });
  }

//bibliotheque:
listeBiblitheques():Observable<BibliothequeWrapper>{
    let jwt = this.authService.getToken();
    jwt = "Bearer"+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.get<BibliothequeWrapper>(this.apiURLCat,{headers:httpHeaders}
    );
    
  }

/*consulterBibliotheque(id:number): Bibliotheque{ 
    return this.bibliotheques.find(bib => bib.idBib == id)!;
    }
  */  
//recherche
rechercherParBibliotheque(idBib: number):Observable< Livre[]> {
      const url = `${this.apiURL}/prodsbib/${idBib}`;
      return this.http.get<Livre[]>(url);
      }    


rechercherParTitre(titre: string):Observable< Livre[]> {
 const url = `${this.apiURL}/prodsByTitre/${titre}`;
  return this.http.get<Livre[]>(url);
 }

 ajouterBibliotheque( bib: Bibliotheque):Observable<Bibliotheque>{
  return this.http.post<Bibliotheque>(this.apiURLCat, bib, httpOptions);
  }

  supprimerBib(id : number) {
    let jwt = this.authService.getToken();
    jwt = "Bearer"+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt}) 
    const url = `${this.apiURLCat}/${id}`;
    return this.http.delete(url, {headers:httpHeaders});
    } 
  
  //image modifier
  uploadImage(file: File, filename: string): Observable<Image>{
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiURL + '/image/upload'}`;
    return this.http.post<Image>(url, imageFormData);
    }

  loadImage(id: number): Observable<Image> {
    const url = `${this.apiURL + '/image/get/info'}/${id}`;
    return this.http.get<Image>(url);
    }

    
///////

   /* loadImageFS(id: number):Observable <number[]> {
      const url = `${this.apiURL + '/image/loadfromFS'}/${id}`;
      return this.http.get<number[]>(url);
      }

*/
uploadImageLivr(file: File, filename: string, idLivr:number): Observable<any>{
      const imageFormData = new FormData();
      imageFormData.append('image', file, filename);
      const url = `${this.apiURL + '/image/uplaodImageLivr'}/${idLivr}`;
      return this.http.post(url, imageFormData);
   }


   addImageLivr(file: File, filename: string, idLivr:number): Observable<any>{
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${this.apiURL + '/image/ImageLivr'}/${idLivr}`;
    return this.http.post(url, imageFormData);
 }
   ////   
   supprimerImage(id : number) {
    const url = `${this.apiURL}/image/delete/${id}`;
    return this.http.delete(url, httpOptions);
    }
    

    uploadImageFS(file: File, filename: string, idLivr: number): Observable<any>{
      const imageFormData = new FormData();
      imageFormData.append('image', file, filename);
      const url = `${this.apiURL + '/image/uploadFS'}/${idLivr}`;
      return this.http.post(url, imageFormData);
    }

    uploadImages(images: FileList): Observable<Image[]> {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
      return this.http.post<Image[]>(`${this.apiURL}/uploadImages`, formData);
    }  
      

}