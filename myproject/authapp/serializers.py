from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'address']

    def create(self, validated_data):
        print(validated_data)
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        try:
            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    'phone_number': validated_data.get('phone_number', ''),
                    'address': validated_data.get('address', '')
                }
            )
        except Exception as e:
            print("Error saving UserProfile:", e)

        return user
