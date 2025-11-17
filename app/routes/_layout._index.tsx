import { RowStart } from '~/components/rowStart';
import { Surface } from '~/components/surface';
import { H1 } from '~/components/typography';

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
          <div className="">
            <h2>WHO AM I</h2>
            <p>
              hi! i'm sean, and i'm a software engineer by trade. i've been
              doing that for about a decade now and am currently based out of
              southern Arizona. during that time i've done full stack web
              development, but my most recent years have been primarily focused
              on frontend platform work.
              <br />
              prior to working in software, i was employed as a mechanical
              engineer for a few years. i enjoyed that time, but it wasn't the
              right fit for me long-term. i eventually went back to university
              to start over as a software engineer. concurrent with both of
              those careers, i've fancied myself a bit of an artist, maker, and
              gamer.
              <br />
              i spent the last year or so on an intentional break from my work
              life to refocus my attention on discovering what i truly want to
              spend my time doing when i'm not just ensuring i have adequate
              income. after a handful of hobby dives and false starts, i
              realized that i still just like writing software and making dope
              shit even if nobody is paying me for it.
              <br />
              i'm back in the game now and am throwing this page together as a
              first project in this new phase of my life. in parallel, i'm also
              ramping up on game development and 3d modeling as a path to
              finally unite my primary interests into one cohesive field of both
              work and play.
            </p>
            <h2>WHAT IS THIS THING</h2>
            <p>
              i'm building this website as a bit of a portfolio, a bit of a
              playground for other projects, and a bit of its own free-standing
              art project. it's absolutely under heavy construction, so don't
              expect a ton yet. for now, it's primary function will be as a
              landing page to share with hiring personnel at companies i'm
              interested in working with. if you're one of those people, then
              hi! i promise i'm a good employee and teammate.
            </p>
            <h2>SUPER IMPORTANT LINKS</h2>
            <p>here's the links:</p>
            <ul>
              <li>
                - <a href="https://github.com/seanboose">github</a>
              </li>
              <li>
                - <a href="https://www.linkedin.com/in/seanboose/">linkedin</a>
              </li>
            </ul>
          </div>
        </Surface>
      </div>
    </div>
  );
}
