from fastapi import HTTPException, status as http_status
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.models import User, UserCreate, UserUpdate, UserRead, Preview
from sqlalchemy import select, func
from uuid import UUID


class UsersCRUD:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, data: UserCreate) -> UserRead:
        values = data.dict()
        user = User(**values)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get(self, user_id: str | UUID) -> User:
        statement = select(User).where(User.uuid == user_id)
        results = await self.session.execute(statement)
        user = results.scalars().first()

        if user is None:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND, detail="User not found")

        return user

    async def patch(self, user_id: str | UUID, data: UserUpdate) -> UserRead:
        statement = select(User).where(User.uuid == user_id)
        results = await self.session.execute(statement)
        user = results.scalars().first()

        if user is None:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND, detail="User not found")

        update_data = data.dict(exclude_unset=True)
        for key, attr in update_data.items():
            setattr(user, key, attr)

        await self.session.commit()
        await self.session.refresh(user)

        return user

    async def get_all(self) -> list[User]:
        statement = select(User).order_by(User.created_at)
        results = await self.session.execute(statement)
        users = results.scalars().all()

        return users

    async def get_user_profile(self, username: str) -> Preview:
        statement = select(User).where(User.username == username)
        result = await self.session.execute(statement)
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND, detail="User Profile not found"
            )

        return user

        # async def check_user_is_created(self, stx_address_mainnet: str) -> bool:

    #     statement = select(User).where(User.stx_address_mainnet == stx_address_mainnet)
    #     results = await self.session.execute(statement)
    #     user = results.scalars().first()
    #     if user is None:
    #         raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="User not found")
    #
    #     return user
    #
    # async def check_username(self, username: str) -> bool:
    #     statement = select(User).where(User.username == username)
    #     results = await self.session.execute(statement)
    #     user = results.scalars().first()
    #     if user is None:
    #         raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Username not found")
    #
    #     return user

    async def check_field_exists(self, field: str, value: str) -> bool:
        valid_fields = ['stx_address_mainnet', "username", "supabase_user_id", "email"]
        if field not in valid_fields:
            raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST, detail="Invalid field")

        query = select(func.count()).select_from(User).where(getattr(User, field) == value)
        try:
            results = await self.session.execute(query)
            count = results.scalar()
            return count > 0
        except Exception as e:
            raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"An error occurred while checking the field: {str(e)}")
