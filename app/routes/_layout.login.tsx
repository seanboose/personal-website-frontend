import { type ActionFunction, Form } from 'react-router';
import { redirect } from 'react-router';

import { Button } from '~/components/button';
import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';
import { H1, H2 } from '~/components/typography';
import { requestAuth } from '~/shared/auth';

export const action: ActionFunction = async ({ request }) => {
  const { headers } = await requestAuth();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/';
  return redirect(redirectTo, { headers });
};

export default function Login() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <H1>authorization required</H1>
      <div className="flex flex-col lg:flex-row gap-4">
        <RowStart />
        <Surface className="w-sm lg:w-lg">
          <div className="flex flex-col gap-4">
            <H2>Login</H2>
            <p>sorry, but you must be logged in to view this page!</p>
            <Form method="post">
              <Button className="w-full">login</Button>
            </Form>
          </div>
        </Surface>
      </div>
    </div>
  );
}
