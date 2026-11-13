// ASSETS
export const asset_kind = [
  'source_photo',
  'model_copy',
  'still',
  'video_clip',
  'final_video',
] as const

export const asset_status = ['uploading', 'ready', 'failed'] as const

export type AssetKindType = (typeof asset_kind)[number]
export type AssetStatusType = (typeof asset_status)[number]

//PROJECTS
export const project_mode = ['photo', 'ugc', 'template'] as const

export type ProjectModeType = (typeof project_mode)[number]

export const ProjectStatus = [
  'drafting',
  'ready',
  'generating',
  'done',
] as const
export type ProjectStatusType = (typeof ProjectStatus)[number]

export type ProjectSettings = {
  ratio: '9:16' | '1:1' | '16:9'
  variations: number
}
