import { NgModule } from '@angular/core';
import { MatButtonModule,
         MatCheckboxModule,
         MatChipsModule,
         MatDialogModule,
         MatExpansionModule,
         MatGridListModule,
         MatInputModule,
         MatMenuModule,
         MatRadioModule,
         MatSelectModule,
         MatSliderModule,
         MatTabsModule,
         MatToolbarModule } from '@angular/material';

const LIST = [
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatInputModule,
  MatMenuModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
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
