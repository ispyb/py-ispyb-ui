/** This function makes the object column from parameters  */
export function toColumn(
  text,
  dataField,
  formatter,
  responsiveHeaderStyle,
  hidden
) {
  return {
    text,
    dataField,
    formatter,
    responsiveHeaderStyle,
    hidden,
  };
}
