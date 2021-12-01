import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class DoService {

  constructor(private httpClient: HttpClient) { }

  getDeathByMonth(year, tipo_exibicao, sexo = null, raca_cor = null, escolaridade = null, estado = null, capitulo_cb = null, idade_inf = null, idade_sup = null){
    return this.httpClient.get(`http://127.0.0.1:8000/NumDeclaracoesObitoMensais?ano=${year}&tipo_exibicao=${tipo_exibicao}` +
    (sexo ? `&sexo=${sexo}` : '') +
    (raca_cor ? `&raca_cor=${raca_cor}` : '') + 
    (escolaridade ? `&escolaridade=${escolaridade}` : '') + 
    (estado ? `&estado=${estado}` : '') +
    (capitulo_cb ? `&capitulo_cb=${capitulo_cb}` : '') +
    (idade_inf ? `&idade_inf=${idade_inf}` : '') + 
    (idade_sup ? `&idade_sup=${idade_sup}` : '')
    );
  }

  getDeathDeclarations(year, limit, page){
    return this.httpClient.get(`http://127.0.0.1:8000/DeclaracoesObito?ano=${year}&limite=${limit}&pagina=${page}`);
  }

  getDeathfulestsDiseases(year, quantity, tipo_exibicao){
    return this.httpClient.get(`http://127.0.0.1:8000/DoencasQueMaisMataram?ano=${year}&quantidade=${quantity}&tipo_exibicao=${tipo_exibicao}`);
  }

  getDeathByState(year, tipo_exibicao){
    return this.httpClient.get(`http://127.0.0.1:8000/MortesPorEstado?ano=${year}&tipo_exibicao=${tipo_exibicao}`);
  }

  getDeathByColor(year, tipo_exibicao){
    return this.httpClient.get(`http://127.0.0.1:8000/MortesPorRacaCor?ano=${year}&tipo_exibicao=${tipo_exibicao}`);
  }
}
