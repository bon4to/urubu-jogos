import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardScannerService } from '../../services/card-scanner.service';
import { CardService, Cartao } from '../../services/card.service';
import { AlertController, ActionSheetController, ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-credit-cards',
  templateUrl: './credit-cards.page.html',
  styleUrls: ['./credit-cards.page.scss'],
})
export class CreditCardsPage implements OnInit {
  cards: Cartao[] = [];

  cardForm: FormGroup = this.formBuilder.group({
    nmTitular:   ['', [Validators.required, Validators.minLength(3)]],
    numero:      ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
    dtExpiracao: ['', [Validators.required]],
    cvv:         ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    bandeira:    ['', [Validators.required]]
  });
  isAddingCard = false;

  constructor(
    private router: Router,
    private cardScannerService: CardScannerService,
    private cardService: CardService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCards();
  }

  // Método para formatar a data de expiração para exibição
  formatarDataExpiracao(data: string): string {
    if (!data) return '';
    
    try {
      const dataObj = new Date(data);
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataObj.getFullYear().toString().slice(-2);
      return `${mes}/${ano}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return data;
    }
  }

  async loadCards() {
    const loading = await this.loadingController.create({
      message: 'Carregando cartões...'
    });
    await loading.present();

    try {
      // Check if user is authenticated
      const isAuthenticated = await this.authService.isAuthenticated$.pipe(take(1)).toPromise();
      
      if (isAuthenticated) {
        // If authenticated, load cards from the service
        this.cards = await this.cardService.listarCartoes().toPromise() || [];
      } else {
        // If not authenticated, use mock data for demonstration
        console.log('Usando dados de demonstração para cartões');
        this.cards = [
          {
            idCartao: 1,
            nmTitular: 'João da Silva',
            numero: '4111111111111111',
            dtExpiracao: '2025-12-31',
            cvv: '123',
            bandeira: 'VISA'
          },
          {
            idCartao: 2,
            nmTitular: 'Maria Oliveira',
            numero: '5555555555554444',
            dtExpiracao: '2024-10-31',
            cvv: '456',
            bandeira: 'MASTERCARD'
          },
          {
            idCartao: 3,
            nmTitular: 'Carlos Santos',
            numero: '378282246310005',
            dtExpiracao: '2023-08-31',
            cvv: '789',
            bandeira: 'AMEX'
          }
        ];
      }
      
      console.log('Cards loaded:', this.cards);
    } catch (error) {
      console.error('Erro ao carregar cartões:', error);
      this.showToast('Erro ao carregar cartões');
    } finally {
      loading.dismiss();
    }
  }

  async adicionarCartao() {
    try {
      // Mostrar menu de opções
      const actionSheet = await this.actionSheetController.create({
        header: 'Como deseja adicionar o cartão?',
        buttons: [
          {
            text: 'Preencher manualmente',
            icon: 'create-outline',
            handler: () => {
              this.preencherManualmente();
            }
          },
          {
            text: 'Escanear cartão',
            icon: 'camera-outline',
            handler: () => {
              this.escanearCartao();
            }
          },
          {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel'
          }
        ]
      });

      await actionSheet.present();
    } catch (error) {
      console.error('Erro ao abrir o menu de opções:', error);
      
      // Exibe uma mensagem de erro
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Não foi possível abrir o menu de opções. Tente novamente.',
        buttons: ['OK']
      });
      
      await alert.present();
    }
  }

  async preencherManualmente() {
    // Mostra o modal de adição de cartão
    this.isAddingCard = true;
  }

  async addCard() {
    // Verifica se o formulário é válido
    if (this.cardForm.valid) {
      // Mostra o loading
      const loading = await this.loadingController.create({
        message: 'Adicionando cartão...'
      });
      await loading.present();

      try {
        // Verifica se o usuário está autenticado
        const isAuthenticated = await this.authService.isAuthenticated$.pipe(take(1)).toPromise();
        
        if (isAuthenticated) {
          // Adiciona o cartão ao serviço
          const cardData = {
            ...this.cardForm.value,
            numero: this.cardForm.value.numero.toString(),
            dtExpiracao: this.cardForm.value.dtExpiracao
          };
          
          await this.cardService.adicionarCartao(cardData).toPromise();
          this.showToast('Cartão adicionado com sucesso');
        } else {
          // Adiciona o cartão aos dados de demonstração
          const newCard = {
            idCartao: this.cards.length + 1,
            ...this.cardForm.value
          };
          
          this.cards.push(newCard);
          this.showToast('Cartão adicionado com sucesso (modo demonstração)');
        }
        
        this.isAddingCard = false;
        this.cardForm.reset();
        this.loadCards();

      } catch (error) {
        console.error('Erro ao adicionar cartão:', error);
        this.showToast('Erro ao adicionar cartão');

      } finally {
        loading.dismiss();
      }
    } else {  
      // Marca todos os campos como tocados para que as validações sejam exibidas
      Object.keys(this.cardForm.controls).forEach(key => {
        const control = this.cardForm.get(key);
        control?.markAsTouched();
      });
      this.showToast('Por favor, preencha todos os campos corretamente');
    }
  }

  async escanearCartao() {
    try {
      // Abre a câmera para escanear o cartão
      const imageData = await this.cardScannerService.scanCard();
      
      // Processa a imagem do cartão
      console.log('Imagem do cartão capturada:', imageData);
      
      // Exibe uma mensagem de sucesso
      this.showToast('Cartão escaneado com sucesso!');
    } catch (error) {
      console.error('Erro ao escanear cartão:', error);
      this.showToast('Erro ao escanear cartão');
    }
  }


  async removerCartao(id: number) {
    // Se id for 0, significa que idCartao é undefined
    if (id === 0) {
      this.showToast('ID do cartão não encontrado');
      return;
    }
    
    try {
      const alert = await this.alertController.create({
        header: 'Confirmar exclusão',
        message: 'Tem certeza que deseja remover este cartão?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Remover',
            handler: async () => {
              const loading = await this.loadingController.create({
                message: 'Removendo cartão...'
              });
              await loading.present();
              
              try {
                // Verifica se o usuário está autenticado
                const isAuthenticated = await this.authService.isAuthenticated$.pipe(take(1)).toPromise();
                
                if (isAuthenticated) {
                  // Remove o cartão do serviço
                  await this.cardService.deletarCartao(id).toPromise();
                  this.showToast('Cartão removido com sucesso');
                } else {
                  // Remove o cartão dos dados de demonstração
                  this.cards = this.cards.filter(card => card.idCartao !== id);
                  this.showToast('Cartão removido com sucesso (modo demonstração)');
                }
                
                this.loadCards();
              } catch (error) {
                console.error('Erro ao remover cartão:', error);
                this.showToast('Erro ao remover cartão');
              } finally {
                loading.dismiss();
              }
            }
          }
        ]
      });
      
      await alert.present();
    } catch (error) {
      console.error('Erro ao confirmar exclusão:', error);
      this.showToast('Erro ao confirmar exclusão');
    }
  }


  async definirPadrao(id: number) {
    // Se id for 0, significa que idCartao é undefined
    if (id === 0) {
      this.showToast('ID do cartão não encontrado');
      return;
    }
    
    this.showToast('Funcionalidade em desenvolvimento');
  }


  // Cancela a adição de cartão
  cancelarAdicao() {
    this.isAddingCard = false;
    this.cardForm.reset();
  }


  // Exibe uma mensagem
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }
}