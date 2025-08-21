import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import Swal from 'sweetalert2';

import { PlaylistService } from '../../core/service/playlist.service';
import { MusicaService } from '../../core/service/musica.service';
import { MusicaDTO } from '../../core/model/musica/musica-dto';
import { RespostaExceptionsDTO } from '../../core/model/exceptions/resposta-exceptions-dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  prompt: string = '';
  listaDeMusicas: string = '';
  listaDeMusicasPadrao: string = '';

  loadingPlaylist: boolean = false;
  loadingMusica: boolean = false;

  cont: number = 0;

  musicas: MusicaDTO[] = [];
  respostaExceptions: RespostaExceptionsDTO = new RespostaExceptionsDTO();

  constructor(
    private playlistService: PlaylistService,
    private musicaService: MusicaService
  ) {}

  /** Gera a playlist completa com base no prompt */
  gerarPlaylist(): void {
    if (!this.prompt.trim()) return;

    const promptTemp = this.prompt.trim();
    this.resetPlaylist();

    this.loadingPlaylist = true;
    this.playlistService.gerarPlaylist(promptTemp).subscribe({
      next: (resposta: MusicaDTO[]) => {
        this.musicas = resposta;
        this.atualizarListaDeMusicas();
        this.loadingPlaylist = false;
      },
      error: (error: RespostaExceptionsDTO) => {
        this.loadingPlaylist = false;
        this.exibirErro(error);
      },
    });
  }

  /** Gera uma música individual e atualiza a lista */
  gerarMusica(id: string): void {
    this.cont++;
    this.deletarMusica(id);
    this.loadingMusica = true;

    this.musicaService.gerarMusica(this.listaDeMusicas).subscribe({
      next: (musica: MusicaDTO) => {
        this.musicas.push(musica);
        this.adicionarMusicaNaLista(musica);
        this.loadingMusica = false;
      },
      error: (error: RespostaExceptionsDTO) => {
        this.loadingMusica = false;
        this.exibirErro(error);
      },
    });

    if (this.cont > 10) this.atualizarListaDeMusicas();
  }

  /** Remove música pelo ID */
  deletarMusica(id: string): void {
    this.musicas = this.musicas.filter(m => m.id !== id);
  }

  /** Atualiza a string com todas as músicas */
  private atualizarListaDeMusicas(): void {
    this.listaDeMusicasPadrao = this.musicas
      .map(m => `${m.titulo} ${m.artista}`)
      .join(', ') + (this.musicas.length ? ', ' : '');
    this.listaDeMusicas = this.listaDeMusicasPadrao;
  }

  /** Adiciona uma música específica à string da playlist */
  private adicionarMusicaNaLista(musica: MusicaDTO): void {
    this.listaDeMusicas += `${musica.titulo} ${musica.artista}, `;
  }

  /** Reseta playlist antes de gerar nova */
  private resetPlaylist(): void {
    this.prompt = '';
    this.listaDeMusicas = '';
    this.listaDeMusicasPadrao = '';
    this.musicas = [];
    this.cont = 0;
  }

  /** Exibe erro usando SweetAlert */
  private exibirErro(error: RespostaExceptionsDTO): void {
    this.respostaExceptions = error;
    Swal.fire({
      title: error.mensagem || 'Ocorreu um erro!',
      icon: 'error',
    });
  }
}
