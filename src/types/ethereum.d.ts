import { Eip1193Provider } from "ethers";

interface Window {
  ethereum?: Eip1193Provider;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export {};