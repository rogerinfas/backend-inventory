import { SunatEnvironment } from '../enums/sunat-environment.enum';

/**
 * Entidad SunatConfig - Representa la configuración de SUNAT para una tienda
 */
export class SunatConfig {
  private constructor(
    private readonly _id: string,
    private readonly _storeId: string,
    private _solUsername: string,
    private _solPassword: string,
    private _digitalCertificate: Buffer | null,
    private _certificatePassword: string | null,
    private _apiUrl: string | null,
    private _environment: SunatEnvironment,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(
    id: string,
    storeId: string,
    solUsername: string,
    solPassword: string,
    digitalCertificate?: Buffer,
    certificatePassword?: string,
    apiUrl?: string,
    environment: SunatEnvironment = SunatEnvironment.TEST
  ): SunatConfig {
    const now = new Date();

    return new SunatConfig(
      id,
      storeId,
      solUsername,
      solPassword,
      digitalCertificate || null,
      certificatePassword || null,
      apiUrl || null,
      environment,
      now,
      now
    );
  }

  static fromPersistence(
    id: string,
    storeId: string,
    solUsername: string,
    solPassword: string,
    digitalCertificate: Buffer | null,
    certificatePassword: string | null,
    apiUrl: string | null,
    environment: SunatEnvironment,
    createdAt: Date,
    updatedAt: Date
  ): SunatConfig {
    return new SunatConfig(
      id,
      storeId,
      solUsername,
      solPassword,
      digitalCertificate,
      certificatePassword,
      apiUrl,
      environment,
      createdAt,
      updatedAt
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get storeId(): string {
    return this._storeId;
  }

  get solUsername(): string {
    return this._solUsername;
  }

  get solPassword(): string {
    return this._solPassword;
  }

  get digitalCertificate(): Buffer | null {
    return this._digitalCertificate;
  }

  get certificatePassword(): string | null {
    return this._certificatePassword;
  }

  get apiUrl(): string | null {
    return this._apiUrl;
  }

  get environment(): SunatEnvironment {
    return this._environment;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de negocio
  updateSolCredentials(username: string, password: string): void {
    if (!username || username.trim().length === 0) {
      throw new Error('El nombre de usuario SOL no puede estar vacío');
    }
    if (!password || password.trim().length === 0) {
      throw new Error('La contraseña SOL no puede estar vacía');
    }
    
    this._solUsername = username.trim();
    this._solPassword = password.trim();
    this._updatedAt = new Date();
  }

  updateDigitalCertificate(certificate: Buffer | null, password?: string): void {
    this._digitalCertificate = certificate;
    this._certificatePassword = password || null;
    this._updatedAt = new Date();
  }

  updateApiUrl(apiUrl: string | null): void {
    this._apiUrl = apiUrl?.trim() || null;
    this._updatedAt = new Date();
  }

  changeEnvironment(environment: SunatEnvironment): void {
    this._environment = environment;
    this._updatedAt = new Date();
  }

  isProduction(): boolean {
    return this._environment === SunatEnvironment.PRODUCTION;
  }

  isTest(): boolean {
    return this._environment === SunatEnvironment.TEST;
  }

  hasDigitalCertificate(): boolean {
    return this._digitalCertificate !== null;
  }

  equals(other: SunatConfig): boolean {
    return this._id === other._id;
  }
}
