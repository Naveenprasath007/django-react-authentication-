# authapp/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get the token from the cookie
        access_token = request.COOKIES.get('access_token')
        
        if access_token is None:
            return None  # No authentication credentials found

        # Proceed with the normal JWT authentication process
        validated_token = self.get_validated_token(access_token)
        return self.get_user(validated_token), validated_token
