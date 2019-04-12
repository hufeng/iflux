import { IQLangProps, TPath, TQLang } from './types';

let id = 0;

export class QueryLang {
  private id: number;
  private name: string;
  private lang: TQLang;

  constructor(props: IQLangProps) {
    const { name, lang } = props;
    this.id = ++id;
    this.name = name;
    this.lang = lang;
  }

  meta() {
    const lang = [...this.lang];
    const handler = lang.pop() as Function;
    const deps = lang as Array<TPath>;

    return {
      id: this.id,
      name: this.name,
      deps,
      handler
    };
  }
}

//factory method
export function QL(lang: TQLang, name: string = '') {
  return new QueryLang({ name, lang });
}
