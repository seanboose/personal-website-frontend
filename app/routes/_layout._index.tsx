import { H1 } from '~/components/headers';
import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';

export function meta() {
  return [{ title: 'sean boose party bus' }];
}

export default function Index() {
  return (
    <div className="flex flex-col gap-4">
      <H1>sean boose</H1>
      <div className="flex flex-row gap-4">
        <RowStart />
        <Surface>
          <p>
            welcome to my website!
            <br />
            it's heavily under construction, so don't expect a ton yet
          </p>
        </Surface>
      </div>
    </div>
  );
}
