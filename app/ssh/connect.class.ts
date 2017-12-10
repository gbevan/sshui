
export class Connect {
  constructor(
//    public id: number,
    public name: string,
    public host: string,
    public port: number = 22,
    public user: string,
    public pass: string = '',
    public privkey: string = '',
    public pubkey: string = '',
    public persistent: boolean = true,
    public notes: string = '',
  ) {}
}
