import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  countries = [
    { code: 'BR', name: 'Brasil' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'PT', name: 'Portugal' },
    { code: 'ES', name: 'Espanha' },
    { code: 'FR', name: 'França' },
    { code: 'DE', name: 'Alemanha' },
    { code: 'IT', name: 'Itália' },
    { code: 'UK', name: 'Reino Unido' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.formBuilder.group({
      nome:           ['', [Validators.required, Validators.minLength(3)]],
      celular:        ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cpf:            ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email:          ['', [Validators.required, Validators.email]],
      dtNascimento:   ['', [Validators.required]],
      pais:           ['', [Validators.required]],
      senha:          ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  // <-- Campos de teste -->
  //
  // private initForm() {
  //   this.registerForm = this.formBuilder.group({
  //     nome:           ['Usuário Teste',     [Validators.required, Validators.minLength(3)]],
  //     celular:        ['54999999999',       [Validators.required, Validators.pattern(/^\d{11}$/)]],
  //     cpf:            ['12345678901',       [Validators.required, Validators.pattern(/^\d{11}$/)]],
  //     email:          ['teste@exemplo.com', [Validators.required, Validators.email]],
  //     dtNascimento:   ['2000-01-01',        [Validators.required]],
  //     pais:           ['BR',                [Validators.required]],
  //     senha:          ['123456',            [Validators.required, Validators.minLength(6)]],
  //     confirmarSenha: ['123456',            [Validators.required]]
  //   }, { validator: this.passwordMatchValidator });
  // }

  passwordMatchValidator(g: FormGroup) {
    return g.get('senha')?.value === g.get('confirmarSenha')?.value
      ? null
      : { mismatch: true };
  }

  async register() {
    // Verifica se as senhas coincidem
    if (this.registerForm.valid) {
      // Cria o loading
      const loading = await this.loadingController.create({
        message: 'Criando sua conta...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        // Formata a data de nascimento
        const dtNascimento  = new Date(this.registerForm.value.dtNascimento);
        const formattedDate = dtNascimento.toISOString().split('T')[0];

        // Cria o usuário
        const userData: User = {
          nome:         this.registerForm.value.nome,
          email:        this.registerForm.value.email,
          celular:      this.registerForm.value.celular,
          cpf:          this.registerForm.value.cpf,
          dtNascimento: formattedDate,
          pais:         this.registerForm.value.pais,
          senha:        this.registerForm.value.senha
        };

        // Registra o usuário
        await this.authService.register(userData).toPromise();

        // Alert de sucesso
        const alert = await this.alertController.create({
          header: 'Sucesso',
          message: 'Conta criada com sucesso!',
          buttons: ['OK']
        });
        await alert.present();
        
        // Redireciona para a página de login
        this.goToLogin();
      } catch (error) {
        // Alert de erro
        console.error('Erro ao registrar:', error);
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'Ocorreu um erro ao criar sua conta. Tente novamente.',
          buttons: ['OK']
        });
        await alert.present();
      } finally {
        loading.dismiss();
      }
    } else {
      // Marca todos os campos como tocados
      this.markFormGroupTouched(this.registerForm);
    }
  }

  // Marca todos os campos como tocados
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Redireciona para a página de login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  get nome() {            return this.registerForm.get('nome'); }
  get email() {           return this.registerForm.get('email'); }
  get celular() {         return this.registerForm.get('celular'); }
  get cpf() {             return this.registerForm.get('cpf'); }
  get dtNascimento() {    return this.registerForm.get('dtNascimento'); }
  get pais() {            return this.registerForm.get('pais'); }
  get senha() {           return this.registerForm.get('senha'); }
  get confirmarSenha() {  return this.registerForm.get('confirmarSenha'); }
}

