<?php get_header(); ?>

<h1 class="custom_para">Page Content</h1>

<?php
if (have_posts()) :
    while (have_posts()) : the_post();
        the_content();
    endwhile;
endif;

get_footer();
