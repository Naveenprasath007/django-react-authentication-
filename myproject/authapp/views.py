from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from .serializers import RegisterSerializer,ProfileSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.decorators import api_view

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token is None:
            return Response({"detail": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)

        # Create a response object
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        # Set refresh token cookie (if required, for rotating refresh tokens)
        if 'refresh' in serializer.validated_data:
            # Set the access token in an HTTP-only cookie
            response.set_cookie(
                key='access_token',
                value=serializer.validated_data['access'],
                httponly=True,  # Important: HTTP-only flag
                secure=True,   # Use True in production with HTTPS
                samesite='Lax',  # or 'Strict'
                # max_age=60 * 60 * 24 * 1  # 1-day expiration
            )
            response.set_cookie(
                key='refresh_token',
                value=serializer.validated_data['refresh'],
                httponly=True,
                secure=True,  # Set secure=True in production
                samesite='Lax',
                max_age=60 * 60 * 24 * 1  # 1-day expiration
            )
        
        return response


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            response = JsonResponse({"message": "Login successful"})

            # Set the access token in an HTTP-only cookie
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,  # Important: HTTP-only flag
                secure=True,   # Use True in production with HTTPS
                samesite='Lax',  # or 'Strict'
            )
            # Optionally set the refresh token as well
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite='Lax',
            )

            return response
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = {
            "username": user.username,
            "email": user.email,
        }
        return Response(user_data)
    

class LogoutView(APIView):
    def post(self, request):
        response = JsonResponse({"message": "Logged out successfully"})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response





@api_view(['POST'])
def save_creative_info(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    data = request.data
    profile, created = Profile.objects.get_or_create(user=user)

    serializer = ProfileSerializer(profile, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)