import type { AssetConnectionFormDto } from '@/types/dto/assetConnection.dto';
import type { AssetConnectionForm } from '@/types/assetConnection';

export const toAssetConnectionForm = (dto: AssetConnectionFormDto): AssetConnectionForm => ({
  selectedProvider: dto.selected_provider,
  loginId: dto.login_id,
  loginPassword: dto.login_password,
  helperText: dto.helper_text,
  passwordMessage: dto.password_message,
});
