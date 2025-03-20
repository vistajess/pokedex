import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FIREBASE_FUNCTIONS_URL } from '../data/pokemon/constants/firebase.constant';

// Default message when no Pokémon match is found
export const OPENAI_NO_RESULTS_PROMPT = 'Sorry, I do not know that Pokémon.';

@Injectable({
  providedIn: 'root',
})
export class OpenAIService {

  private firebaseFunctionsUrl: string = FIREBASE_FUNCTIONS_URL; // URL for Firebase functions

  constructor(private http: HttpClient) {}

  // Sends a description to the Firebase function for interpretation and returns the response as an Observable
  interpretDescription(description: string): Observable<string> {
    const url = `${this.firebaseFunctionsUrl}/interpretDescription`; // Constructing the URL for the API call
    return this.http.post<string>(url, { description }); // Making a POST request with the description
  }
}
