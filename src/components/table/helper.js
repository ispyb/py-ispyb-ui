// @flow

type Column = {
  text: string,
  dataField: string,
  formatter: any,
  responsiveHeaderStyle: any,
  hidden: boolean
};

/** This function makes the object column from parameters  */
export function toColumn(text: string, dataField: string, formatter: any, responsiveHeaderStyle: any, hidden: boolean): Column {
  return {
    text,
    dataField,
    formatter,
    responsiveHeaderStyle,
    hidden
  };
}

/** Test flow 
toColumn(
  5,
  'text',
  ['Any'],
  () => {
    return 'any';
  },
  true
);
*/
