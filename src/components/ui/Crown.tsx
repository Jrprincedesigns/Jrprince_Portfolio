/**
 * Hand-drawn crown mark that sits over the "i" in the wordmark and leads the
 * section eyebrows. Strokes use currentColor so it inherits the text color.
 */
export default function Crown({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 27.3502 20.9428"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.00022 19.6297C2.04177 19.3905 3.22765 3.19756 3.51013 3.19756C3.84988 3.19756 3.96736 5.36137 4.01211 5.54557C4.45405 7.3828 5.52033 9.48999 7.02384 10.2401C8.84432 11.1479 12.0534 4.72954 12.5458 3.04151C12.5588 2.99693 12.9967 0.860619 13.1734 1.00723C14.9182 2.45785 14.2657 12.2803 20.3266 11.3357C23.964 10.7689 25.5088 1.6563 26.2251 2.1028C26.483 2.26324 25.9831 6.23483 25.9742 6.48428C25.8092 11.0133 26.3502 15.4523 26.3502 19.9426C19.1217 18.9853 11.7168 18.5262 4.59692 19.9426"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
