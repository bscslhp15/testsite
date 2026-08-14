<?php
namespace app\controllers;

use app\models\User;
use Yii;
use yii\rest\Controller;
use yii\web\BadRequestHttpException;

class AuthController extends Controller
{
    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
            'cors' => [
                'Origin' => ['http://localhost:3000'],
                'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                'Access-Control-Allow-Credentials' => true,
                'Access-Control-Allow-Headers' => ['*'],
                'Access-Control-Expose-Headers' => ['*'],
            ],
        ];
        return $behaviors;
    }

    public function actionRegister()
    {
        $body = Yii::$app->request->bodyParams;
        $user = new User();
        $user->username = $body['username'] ?? null;
        $user->email = $body['email'] ?? null;
        $user->password_hash = password_hash($body['password'] ?? '', PASSWORD_DEFAULT);
        $user->confirmed = false;
        $user->auth_key = bin2hex(random_bytes(16));
        $user->created_at = date('Y-m-d H:i:s');
        if ($user->save()) {
            return [
                'success' => true,
                'message' => 'Registration successful. Please confirm your account.',
                'confirmationToken' => $user->auth_key,
            ];
        }
        return ['success' => false, 'errors' => $user->errors];
    }

    public function actionLogin()
    {
        $body = Yii::$app->request->bodyParams;
        $user = User::findByEmail($body['email'] ?? '');
        if (!$user || !$user->validatePassword($body['password'] ?? '')) {
            throw new BadRequestHttpException('Invalid credentials.');
        }
        return [
            'success' => true,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'confirmed' => $user->confirmed,
                'username' => $user->username,
                'authKey' => $user->auth_key,
            ],
        ];
    }

    public function actionConfirm($token)
    {
        $user = User::findOne(['auth_key' => $token]);
        if (!$user) {
            throw new BadRequestHttpException('Invalid confirmation token.');
        }
        $user->confirmed = true;
        $user->save(false);
        return ['success' => true, 'message' => 'Account confirmed.'];
    }
}
