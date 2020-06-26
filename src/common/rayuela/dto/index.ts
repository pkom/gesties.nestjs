export interface CenterDTO {
  code: string;
  denomination: string;
}

export interface StudentRayuelaDTO {
  nie: string;
  nombre: string;
  'primer-apellido': string;
  'segundo-apellido'?: string;
  'fecha-nacimiento': string;
  grupo?: string;
  'datos-usuario-rayuela'?: {
    'id-usuario': string;
    login: string;
  };
  foto?: {
    formato: string;
    'nombre-fichero': string;
  };
}

export interface TeacherRayuelaDTO {
  dni: string;
  nombre: string;
  'primer-apellido': string;
  'segundo-apellido'?: string;
  departamento?: string;
  'datos-usuario-rayuela'?: {
    'id-usuario': string;
    login: string;
  };
  grupos?: {
    grupo?: string[];
  };
}

export interface TutorGroupRayuelaDTO {
  'nombre-grupo': string;
  'dni-tutor-grupo': string;
}

export interface LevelRayuelaDTO {
  'nombre-curso': string;
  'grupo-curso': TutorGroupRayuelaDTO[];
}

export interface TutorDTO {
  group: string;
  dni: string;
}

export interface LevelDTO {
  level: string;
  groups: TutorDTO[];
}

export interface GroupRayuelaDTO {
  nie: string;
  nombre: string;
  'primer-apellido': string;
  'segundo-apellido'?: string;
  'fecha-nacimiento': string;
  grupo?: string;
  'datos-usuario-rayuela'?: {
    'id-usuario': string;
    login: string;
  };
  foto?: {
    formato: string;
    'nombre-fichero': string;
  };
}

export interface StudentDTO {
  nie: number;
  firstName: string;
  middleName: string;
  lastName?: string;
  birthDate: Date;
  rayuela?: {
    id: number;
    login: string;
  };
  photoFile?: string;
  photoBase64?: string;
}

export interface TeacherDTO {
  idNumber: string;
  dni: string;
  firstName: string;
  middleName: string;
  lastName?: string;
  rayuela?: {
    id: number;
    login: string;
  };
  photoFile?: string;
  photoBase64?: string;
}

export interface GroupDTO {
  group: string;
  denomination: string;
  students?: number[];
  teachers?: string[];
}

export interface DepartmentDTO {
  department: string;
  denomination: string;
  teachers?: string[];
}

export interface AdditionalDTO {
  'Nº Id. Escolar': number;
  'DNI/Pasaporte': string;
  Dirección: string;
  'Código postal': number;
  'Localidad de residencia': string;
  'Fecha de nacimiento': Date;
  'Provincia de residencia': string;
  Teléfono: string;
  'Teléfono de urgencia': string;
  'Correo electrónico': string;
  'Primer apellido': string;
  'Segundo apellido': string;
  Nombre: string;
  'DNI/Pasaporte Primer tutor': string;
  'Primer apellido Primer tutor': string;
  'Segundo apellido Primer tutor': string;
  'Nombre Primer tutor': string;
  'DNI/Pasaporte Segundo tutor': string;
  'Primer apellido Segundo tutor': string;
  'Segundo apellido Segundo tutor': string;
  'Nombre Segundo tutor': string;
  'Localidad de nacimiento': string;
  'Código País nacimiento': number;
  'Código Provincia nacimiento': number;
  Nacionalidad: string;
  'Nº Expte en el centro': number;
  'Teléfono Primer tutor': string;
  'Tlfno. urgencias Primer tutor': string;
  'Correo electrónico Primer tutor': string;
  'Teléfono Segundo tutor': string;
  'Tlfno. urgencias Segundo tutor': string;
  'Correo electrónico Segundo tutor': string;
}

export interface ParentDTO {
  Tutor: string;
  'DNI/Pasaporte': string;
  'Teléfono móvil': string;
  'Teléfono de urgencia': string;
  Domicilio: string;
  'Código postal': number;
  Municipio: string;
  Provincia: string;
}

export interface Coordinate {
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
}
