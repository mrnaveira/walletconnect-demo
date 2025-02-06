import { create } from "zustand";
import { TariProvider } from "@tari-project/tarijs";

export interface ProviderStore<TProvider extends TariProvider> {
    provider: TProvider | null,

    setProvider(provider: TProvider): void;
}

const useTariProvider = create<ProviderStore<TariProvider>>()(
    (set) => ({
        provider: null,
        setProvider(provider) {
            set({provider})
        },
    }),
);

export default useTariProvider;