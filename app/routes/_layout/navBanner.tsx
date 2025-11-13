export function NavBanner() {
  const color = '#544d43'; // --color-border
  const svgDataUri = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58.56 20.22">
        <rect fill="${color}" width="8.22" height="4.44"/>
        <g>
          <circle fill="${color}" cx="27.78" cy="7.89" r="2.61"/>
          <circle fill="${color}" cx="39" cy="7.89" r="2.61"/>
        </g>
        <circle fill="${color}" cx="33.39" cy="17.61" r="2.61"/>
      </svg>
    `)}`;

  return (
    <div
      className="h-4 bg-repeat-x"
      style={{ backgroundImage: `url("${svgDataUri}")` }}
    />
  );
}
