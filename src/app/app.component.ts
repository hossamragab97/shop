import { Component, OnInit } from '@angular/core';
// import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shop';

  ngOnInit(): void {

    $(document).ready(function()
    {
      let body = <HTMLDivElement> document.body;
      let script = document.createElement('script');
      script.innerHTML = '';
      script.src = '../assets/js/script.js';
      script.async = true;
      script.defer = true;
      body.appendChild(script);
    });
  }

  onActivate(event:any) {
    window.scroll(0,0);
}



//   textDir: string = 'ltr';

//   constructor(private translate: TranslateService) {

// this is to determine the text direction depending on the selected language

//     this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
//     {
//       if(event.lang == 'ar')
//       {
//         this.textDir = 'rtl';
//       }
//       else
//       {
//         this.textDir = 'ltr';
//       }
//     });
//   }

}
