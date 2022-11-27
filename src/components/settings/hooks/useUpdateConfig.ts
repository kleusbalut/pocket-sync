import { useCallback } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { configInvalidationAtom, pocketPathAtom } from "../../../recoil/atoms"
import { PocketSyncConfigSelector } from "../../../recoil/selectors"
import { PocketSyncConfig } from "../../../types"
import { invokeSaveFile } from "../../../utils/invokes"

export const useUpdateConfig = () => {
  const currentConfig = useRecoilValue(PocketSyncConfigSelector)
  const pocketPath = useRecoilValue(pocketPathAtom)
  const invalidateConfigSelector = useSetRecoilState(configInvalidationAtom)

  return useCallback(
    async <T extends keyof PocketSyncConfig>(
      key: T,
      value: PocketSyncConfig[T]
    ) => {
      const newConfig = { ...currentConfig, [key]: value } as PocketSyncConfig
      const encoder = new TextEncoder()
      await invokeSaveFile(
        `${pocketPath}/pocket-sync.json`,
        encoder.encode(JSON.stringify(newConfig, null, 2))
      )

      setTimeout(() => invalidateConfigSelector(Date.now()), 500)
    },
    [currentConfig]
  )
}