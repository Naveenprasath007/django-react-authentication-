from django.urls import path
from .views import CookieTokenRefreshView,LoginView, LogoutView, UserDetailView,RegisterView,save_creative_info

urlpatterns = [
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('profile/save/', save_creative_info, name='save_creative_info'),
]
