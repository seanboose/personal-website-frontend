import { H1 } from '~/components/headers';
import { RowStart } from '~/components/rowStart';
import { TextBox } from '~/components/textBox';

export function meta() {
  return [
    { title: 'Sean Boose Party Bus' },
    { name: 'description', content: 'Welcome to my site!!' },
  ];
}

export default function Index() {
  return (
    <div className="flex flex-col gap-4">
      <H1>sean boose</H1>
      <div className="flex flex-row gap-4">
        <RowStart />
        <TextBox>
          <p>
            welcome to my website!
            <br />
            it's heavily under construction, so don't expect a ton yet
          </p>
        </TextBox>
      </div>
    </div>
  );
}
