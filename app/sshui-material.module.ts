import { NgModule } from '@angular/core';
import { MatButtonModule,
         MatCheckboxModule,
         MatChipsModule,
         MatDialogModule,
         MatExpansionModule,
         MatGridListModule,
         MatIconModule,
         MatInputModule,
         MatMenuModule,
         MatPaginatorModule,
         MatRadioModule,
         MatSelectModule,
         MatSliderModule,
         MatSortModule,
         MatTableModule,
         MatTabsModule,
         MatToolbarModule } from '@angular/material';

const LIST = [
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
];

@NgModule({
  imports: LIST,
  declarations: [
  ],
  exports: LIST
})

export class SshuiMaterialModule { }
