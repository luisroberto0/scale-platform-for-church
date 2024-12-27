import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bulk-import-dialog',
  template: `
    <h2 mat-dialog-title>Importar Lista de Usuários</h2>
    <mat-dialog-content>
      <p>Cole a lista de usuários abaixo no formato:</p>
      <pre class="example-format">1. Nome do Usuário
email&#64;exemplo.com
2. Outro Usuário
outro&#64;email.com
3- Ou com traço
outro3&#64;email.com</pre>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Lista de Usuários</mat-label>
        <textarea matInput [(ngModel)]="userList" rows="10"
          placeholder="1. João da Silva&#10;joao.silva@email.com&#10;2. Maria Santos&#10;maria.santos@email.com"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button (click)="onNoClick()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onImport()">Importar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    .example-format {
      background: #f5f5f5;
      padding: 8px;
      border-radius: 4px;
      margin: 8px 0;
      font-size: 14px;
      font-family: monospace;
    }
    pre {
      white-space: pre-wrap;
      margin: 0;
    }
  `]
})
export class BulkImportDialogComponent {
  userList: string = '';

  constructor(
    public dialogRef: MatDialogRef<BulkImportDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onImport(): void {
    const users = this.parseUserList(this.userList);
    this.dialogRef.close(users);
  }

  private parseUserList(text: string): Array<{name: string, email: string}> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const users = [];

    for (let i = 0; i < lines.length; i += 2) {
      if (lines[i] && lines[i + 1]) {
        // Remove number prefix and clean the name
        const name = lines[i]
          .replace(/^\d+\s*[.-]\s*/, '') // Removes "1. " or "1 - " or "1." patterns
          .trim();
        const email = lines[i + 1].toLowerCase().trim();

        if (name && email) {
          users.push({ name, email });
        }
      }
    }

    return users;
  }
}
