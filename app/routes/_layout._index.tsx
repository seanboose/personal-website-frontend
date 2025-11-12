import { RowStart } from '~/components/rowStart';

export function meta() {
  return [
    { title: 'Sean Boose Party Bus' },
    { name: 'description', content: 'Welcome to my site!!' },
  ];
}

export default function Index() {
  return (
    <div className="mt-8">
      <h1>HOME PAGE</h1>
      <div className="flex flex-row">
        <RowStart />
        <div className="bg-surface border-border-subtle border-b-2 border-r-2">
          <p>askdljadslkasd asdas das asd das</p>
        </div>
      </div>
    </div>
  );
}
