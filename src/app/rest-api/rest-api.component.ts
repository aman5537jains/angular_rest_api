import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
@Component({
  selector: 'app-rest-api',
  templateUrl: './rest-api.component.html',
  styleUrls: ['./rest-api.component.css']
})
export class RestApiComponent implements OnInit {

  constructor(private http: HttpClient) { }
  callJsonGetRestApiResponse: string;
  callJsonDataRestApiResponse: string;
  callFormDataRestApiResponse: string;
  ngOnInit() {

       
      
  }

  onClick(type:string="callJsonGetRestApi"){
    if(type=="callJsonGetRestApi"){
      this.callJsonGetRestApi("https://reqres.in/api/users").subscribe(data=>{
          this.callJsonGetRestApiResponse=JSON.stringify(data);
          console.log("called from callJsonGetRestApi",data)
      });
    }

    else if(type=="callJsonDataRestApi"){
      this.callJsonDataRestApi("https://reqres.in/api/users",{name:"test",email:"test@yxyz.com"}).subscribe(data=>{
        this.callJsonDataRestApiResponse=JSON.stringify(data);
        console.log("called from callJsonDataRestApi",data)
      });
    }
    else{
      this.callFormDataRestApi("http://localhost/test.php",{name:"test",email:"test@yxyz.com"}).subscribe(data=>{
        this.callFormDataRestApiResponse=JSON.stringify(data);
        console.log("called from callFormDataRestApi",data)
      });;
    }
  }

// calling get rest api   
callJsonGetRestApi(url):Observable<any> {
   
    
    return this.http.get(url)
      .pipe(map((data: any) => {
      //handle api 200 response code here or you wanted to manipulate to response
        return data;

      }),
        catchError((error) => {    // handle error
         
          if (error.status == 404) {
            //Handle Response code here
          }
          return throwError(error);
        })
      );

  }

// calling json post rest api 

callJsonDataRestApi(url: string, form: Object) {

    

    return this.http.post(url,form)
      .pipe(map((data: any) => {
      //handle api 200 response code here or you wanted to manipulate to response
        return data;

      })
      ,
       catchError((error) => {    // handle error
         
          if (error.status == 404) {
            //Handle Response code here
          }
          return throwError(error);
        })
      );

}


// calling form data post rest api 

callFormDataRestApi(url: string, form: Object) {

  let formData = form;//{name:"test",email:"test@yxyz.com"};
  const uploadData = new FormData();
  for (let i in form) {
    if (form[i] instanceof Blob) // check is file
      uploadData.append(i, form[i], form[i].name ? form[i].name : "");
    else if (form[i] instanceof Array) { //check type of Array

      for (let arr in form[i]) {
        for (let lst in form[i][arr]) {
          if (form[i][arr][lst] instanceof Blob) { // check is file
           
            uploadData.append("" + i + "[" + arr + "][" + lst + "]", form[i][arr][lst], form[i][arr][lst].name ? form[i][arr][lst].name : "");
          }
          else {
            uploadData.append("" + i + "[" + arr + "][" + lst + "]", form[i][arr][lst]);
          }
        }
      }
    }
    else
      uploadData.append(i, form[i]);
  }
  formData = uploadData
  let headers = new HttpHeaders({
   'Authorization': 'Bearer your_token'   //add your api token for auth
  }).set('Content-Type', []);

  return this.http.post(url,formData, { headers: headers})
    .pipe(map((data: any) => {
    //handle api 200 response code here or you wanted to manipulate to response
      return data;

    })
    ,
     catchError((error) => {    // handle error
       
        if (error.status == 404) {
          //Handle Response code here
        }
        return throwError(error);
      })
    );

}  

   
}
