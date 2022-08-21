export default class WorkTime {
  #id: any;
  #date: string;
  #inTime: string;
  #outTime: string;

  constructor(date: string, inTime: string, outTime: string, id: any = null) {
    this.#date = date;
    this.#inTime = inTime;
    this.#outTime = outTime;
    this.#id = id;
  }

  static blank() {
    return new WorkTime("", "", "");
  }

  get id() {
    return this.#id;
  }
  get date() {
    return this.#date;
  }
  get inTime() {
    return this.#inTime;
  }
  get outTime() {
    return this.#outTime;
  }

}
