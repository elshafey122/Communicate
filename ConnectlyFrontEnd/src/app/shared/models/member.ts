export interface Member {
    id: string
    userName: string
    imageUrl?: string
    gender: string
    dateOfBirth: string
    created: string
    lastActive: string
    description?: string
    city: string
    country: string
}

export interface Photo {
    id: number,
    publicId?: string
    url: string
    memberId: string
}

export interface EditableMember{
    userName: string
    description?: string
    city: string
    country: string
}