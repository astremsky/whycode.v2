import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent {
  code = '';
  result = '';
  displayedResult = '';
  loading = false;
  currentYear = new Date().getFullYear();

  constructor(private zone: NgZone) {}

  async submit(action: 'explain' | 'improve') {
    this.zone.run(() => {
      this.loading = true;
      this.result = '';
      this.displayedResult = '';
    });

    try {
      const res = await fetch('/api/whycode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: this.code,
          action,
        }),
      });

      const data = await res.json();

      const content =
        data?.output?.trim() || 'No content returned';

      this.zone.run(() => {
        this.result = content;
        this.loading = false;
        this.typeWriterEffect(content);
      });
    } catch (error: any) {
      this.zone.run(() => {
        this.result = `Error: ${error.message || error}`;
        this.displayedResult = this.result;
        this.loading = false;
      });
    }
  }

  typeWriterEffect(text: string, speed: number = 10) {
    this.displayedResult = '';
    let i = 0;

    const type = () => {
      if (i <= text.length) {
        this.displayedResult = text.slice(0, i);
        i++;
        setTimeout(type, speed);
      }
    };

    type();
  }
}
