import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private apiBaseUrl = "http://localhost:3000/api";
  private apiBaseUrl = "https://cs624-tp.herokuapp.com/api";

  constructor(
    private http: HttpClient,
  ) { }

  private handleError(error: any): Promise<any> {
    console.error("Something has gone wrong", error);
    return Promise.reject(error.message || error);
  }

  public makeApiCall(
    reqType: "post" | "delete" | "put" | "get",
    urlPath: string, {
    body,
    options = {}
  }: any = {}): Promise<any> {
    console.log(reqType, urlPath, body, options);
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return (reqType == "post" || reqType == "put"
      ? this.http[reqType](url, body, options)
      : this.http[reqType](url, options))
      .toPromise()
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(this.handleError);
  }
}
