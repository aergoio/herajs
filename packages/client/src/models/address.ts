import { Address } from '@herajs/common'; 

export type AddressInput = ConstructorParameters<typeof Address>[0];
export { Address };
export default Address;