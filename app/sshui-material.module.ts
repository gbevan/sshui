import { NgModule } from '@angular/core';
import { MatButtonModule,
         MatCheckboxModule,
         MatChipsModule,
         MatDialogModule,
         MatExpansionModule,
         MatGridListModule,
         MatIconModule,
         MatIconRegistry,
         MatInputModule,
         MatMenuModule,
         MatPaginatorModule,
         MatRadioModule,
         MatSelectModule,
         MatSliderModule,
         MatSortModule,
         MatProgressSpinnerModule,
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
  MatProgressSpinnerModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
];

@NgModule({
  imports: LIST,
  declarations: [
  ],
  providers: [
    MatIconRegistry
  ],
  exports: LIST
})

export class SshuiMaterialModule { }

export {
  MatIconRegistry
};
