import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class DoService {

  constructor(private httpClient: HttpClient) { }

  getDeathByMonth(year, tipo_exibicao){
    return this.httpClient.get(`http://127.0.0.1:8000/NumDeclaracoesObitoMensais?ano=${year}&tipo_exibicao=${tipo_exibicao}`);
  }

  getDeathDeclarations(year, limit, page){
    return this.httpClient.get(`http://127.0.0.1:8000/DeclaracoesObito?ano=${year}&limite=${limit}&pagina=${page}`);
  }
}
